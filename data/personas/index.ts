// ABOUTME: Registry mapping URL slugs to persona landing page configs
// ABOUTME: Import new persona configs here as they're created

import type { PersonaLandingConfig } from "@/types/persona-landing";
import { freshStartConfig } from "./fresh-start";
import { smartSellersConfig } from "./smart-sellers";
import { investorsConfig } from "./investors";
import { startingOverConfig } from "./starting-over";
import { familyHomeConfig } from "./family-home";
import { fireConfig } from "./fire";
import { yourWayConfig } from "./your-way";
import { nextChapterConfig } from "./next-chapter";
import { experiencedSellersConfig } from "./experienced-sellers";

export const personaConfigs: Record<string, PersonaLandingConfig> = {
  "fresh-start": freshStartConfig,
  "smart-sellers": smartSellersConfig,
  "investors": investorsConfig,
  "starting-over": startingOverConfig,
  "family-home": familyHomeConfig,
  "fire": fireConfig,
  "your-way": yourWayConfig,
  "next-chapter": nextChapterConfig,
  "experienced-sellers": experiencedSellersConfig,
};

export const validSlugs = Object.keys(personaConfigs);
