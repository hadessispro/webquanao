// Size finder ("tìm size") configuration.
//
// The finder maps desired fit (ôm / thoải mái) + height + weight to a suggested
// size using a matrix. This used to be hardcoded; it is now editable in the
// admin under Site Settings -> Size finder. This module holds the shared type,
// the built-in default (used as a fallback), and the lookup helpers.

export type SizeFinderFitKey = "ôm" | "thoải mái";

export interface SizeFinderFit {
  key: string; // "ôm" | "thoải mái"
  label: string;
  weights: string[];
  // matrix[heightIndex][weightIndex] = suggested size
  matrix: string[][];
}

export interface SizeFinderConfig {
  heights: string[];
  fits: SizeFinderFit[];
}

export const DEFAULT_SIZE_FINDER: SizeFinderConfig = {
  heights: ["≤1m66", "1m68–1m70", "1m71–1m75", "1m76–1m78", "1m80–1m87"],
  fits: [
    {
      key: "ôm",
      label: "ôm",
      weights: [
        "≤53 kg",
        "54–58 kg",
        "59–61 kg",
        "62–64 kg",
        "65–69 kg",
        "70–74 kg",
        "75–81 kg",
        "82–86 kg",
      ],
      matrix: [
        ["S", "S", "S", "M", "M", "L", "XL", "XXL"],
        ["S", "S", "M", "M", "M", "L", "XL", "XXL"],
        ["S", "M", "M", "M", "M", "L", "XL", "XXL"],
        ["M", "M", "M", "L", "L", "XL", "XL", "XXL"],
        ["M", "L", "L", "L", "XL", "XL", "XXL", "XXL"],
      ],
    },
    {
      key: "thoải mái",
      label: "thoải mái",
      weights: [
        "≤53kg",
        "54–60kg",
        "61–63kg",
        "64–66kg",
        "67–73kg",
        "74–78kg",
        "79–85kg",
      ],
      matrix: [
        ["S", "M", "M", "L", "XL", "XXL", "XXL"],
        ["S", "M", "M", "L", "L", "XL", "XXL"],
        ["S", "M", "M", "L", "L", "XL", "XXL"],
        ["M", "M", "L", "L", "XL", "XL", "XXL"],
        ["M", "L", "L", "XL", "XL", "XL", "XXL"],
      ],
    },
  ],
};

// Validate/normalize whatever is stored in the admin JSON field, falling back to
// the built-in default if the shape is invalid. This keeps the finder working
// even if the config is empty or malformed.
export function normalizeSizeFinder(raw: unknown): SizeFinderConfig {
  // The value may arrive as a parsed object or, depending on the DB adapter, as
  // a JSON string. Handle both.
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return DEFAULT_SIZE_FINDER;
    }
  }

  if (!value || typeof value !== "object") return DEFAULT_SIZE_FINDER;

  const cfg = value as Partial<SizeFinderConfig>;
  if (!Array.isArray(cfg.heights) || cfg.heights.length === 0) return DEFAULT_SIZE_FINDER;
  if (!Array.isArray(cfg.fits) || cfg.fits.length === 0) return DEFAULT_SIZE_FINDER;

  const fits = cfg.fits
    .filter(
      (fit) =>
        fit &&
        typeof fit === "object" &&
        Array.isArray((fit as SizeFinderFit).weights) &&
        Array.isArray((fit as SizeFinderFit).matrix),
    )
    .map((fit) => {
      const f = fit as SizeFinderFit;
      return {
        key: String(f.key || f.label || ""),
        label: String(f.label || f.key || ""),
        weights: f.weights.map((w) => String(w)),
        matrix: f.matrix.map((row) => (Array.isArray(row) ? row.map((s) => String(s)) : [])),
      };
    })
    .filter((fit) => fit.key);

  if (fits.length === 0) return DEFAULT_SIZE_FINDER;

  return {
    heights: cfg.heights.map((h) => String(h)),
    fits,
  };
}

export interface ProductSizeFinderRule {
  height?: string;
  weight?: string;
  fit?: string;
  size?: string;
}

export interface ProductSizeFinderConfig {
  mode?: "inherit" | "custom" | "disabled";
  fitPreference?: "auto" | "both" | "single" | "none";
  customHeights?: string;
  customWeights?: string;
  customWeightsComfort?: string;
  sizeRules?: ProductSizeFinderRule[];
  customMatrixText?: string;
}

export function parseLines(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Convert a product's custom size finder settings into a SizeFinderConfig matrix,
// or fallback to the site-wide default.
export function buildProductCustomFinder(
  productConfig: ProductSizeFinderConfig,
  fallbackConfig: SizeFinderConfig = DEFAULT_SIZE_FINDER,
): { config: SizeFinderConfig; showFitPreference: boolean; disabled: boolean } {
  const mode = productConfig.mode || "inherit";
  if (mode === "disabled") {
    return {
      config: fallbackConfig,
      showFitPreference: false,
      disabled: true,
    };
  }

  if (mode === "inherit") {
    return {
      config: fallbackConfig,
      showFitPreference: true,
      disabled: false,
    };
  }

  // mode === 'custom'
  const heights = parseLines(productConfig.customHeights);
  const resolvedHeights = heights.length > 0 ? heights : fallbackConfig.heights;

  const weightsStandard = parseLines(productConfig.customWeights);
  const fallbackFitStandard = fallbackConfig.fits[0];
  const resolvedWeightsStandard =
    weightsStandard.length > 0
      ? weightsStandard
      : fallbackFitStandard?.weights || [];

  const weightsComfort = parseLines(productConfig.customWeightsComfort);
  const fallbackFitComfort = fallbackConfig.fits[1] || fallbackFitStandard;
  const resolvedWeightsComfort =
    weightsComfort.length > 0
      ? weightsComfort
      : weightsStandard.length > 0
        ? weightsStandard
        : fallbackFitComfort?.weights || [];

  const fitPref = productConfig.fitPreference || "auto";
  const hasBothFits = fitPref === "both";
  const isSingleFit = fitPref === "single" || fitPref === "none";

  // Build matrix lookup from sizeRules if provided
  const rules = Array.isArray(productConfig.sizeRules) ? productConfig.sizeRules : [];

  // Helper to resolve size for a cell
  const getRuleSize = (h: string, w: string, fitKey: string): string => {
    // 1. exact match
    const match = rules.find(
      (r) =>
        r.size &&
        r.height?.trim() === h.trim() &&
        r.weight?.trim() === w.trim() &&
        (r.fit === "all" || !r.fit || r.fit === fitKey),
    );
    if (match?.size) return match.size.trim();

    // 2. parse quick matrix text if present
    // Format: height | size1, size2, size3... or tab/comma separated
    if (productConfig.customMatrixText) {
      const lines = parseLines(productConfig.customMatrixText);
      for (const line of lines) {
        if (line.toLowerCase().includes(h.toLowerCase())) {
          const parts = line.split(/[|,;\t]/).map((p) => p.trim());
          // remove the height part if it matched
          const sizes = parts.filter((p) => p !== h && p.length > 0);
          const wIdx = (fitKey === "thoải mái" ? resolvedWeightsComfort : resolvedWeightsStandard).indexOf(w);
          if (wIdx >= 0 && sizes[wIdx]) {
            return sizes[wIdx];
          }
        }
      }
    }

    return "";
  };

  const fits: SizeFinderFit[] = [];

  if (isSingleFit) {
    const matrix = resolvedHeights.map((h) =>
      resolvedWeightsStandard.map((w) => getRuleSize(h, w, "tiêu chuẩn")),
    );
    fits.push({
      key: "tiêu chuẩn",
      label: "tiêu chuẩn",
      weights: resolvedWeightsStandard,
      matrix,
    });
  } else {
    // Has both fits or auto
    const matrixOm = resolvedHeights.map((h) =>
      resolvedWeightsStandard.map((w) => getRuleSize(h, w, "ôm")),
    );
    fits.push({
      key: "ôm",
      label: "ôm",
      weights: resolvedWeightsStandard,
      matrix: matrixOm,
    });

    const matrixComfort = resolvedHeights.map((h) =>
      resolvedWeightsComfort.map((w) => getRuleSize(h, w, "thoải mái")),
    );
    fits.push({
      key: "thoải mái",
      label: "thoải mái",
      weights: resolvedWeightsComfort,
      matrix: matrixComfort,
    });
  }

  return {
    config: {
      heights: resolvedHeights,
      fits,
    },
    showFitPreference: hasBothFits || (fitPref === "auto" && !isSingleFit),
    disabled: false,
  };
}

export function getSizeFinderFit(
  config: SizeFinderConfig,
  key: string,
): SizeFinderFit | undefined {
  return config.fits.find((fit) => fit.key === key) || config.fits[0];
}

export function resolveSizeFromFinder(
  config: SizeFinderConfig,
  fitKey: string,
  height: string,
  weight: string,
): string | null {
  const fit = getSizeFinderFit(config, fitKey);
  if (!fit) return null;
  const heightIndex = config.heights.findIndex((item) => item === height);
  const weightIndex = fit.weights.findIndex((item) => item === weight);
  if (heightIndex < 0 || weightIndex < 0) return null;
  return fit.matrix[heightIndex]?.[weightIndex] || null;
}

