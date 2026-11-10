import { describe, expect, it } from "vitest";

import { getOneaiCapabilities } from "./get-oneai-capabilities";

describe("getOneaiCapabilities", () => {
  it("returns the English agent card with model, instruction, tools, and knowledge", () => {
    // Act
    const capabilities = getOneaiCapabilities({ lang: "en" });
    const createAgents = capabilities.find(
      (capability) => capability.title === "Create agents"
    );

    // Assert
    expect(capabilities).toHaveLength(8);
    expect(capabilities.map((capability) => capability.title)).not.toContain(
      "Multiple Providers"
    );
    expect(createAgents).toEqual({
      title: "Create agents",
      text: "Personal, or shared with the team. Pick the model, set the system instruction, allow tools and capabilities, and connect knowledge. Or make one by chatting with a model in OneAI."
    });
  });

  it("returns the Indonesian agent card", () => {
    // Act
    const capabilities = getOneaiCapabilities({ lang: "id" });
    const createAgents = capabilities.find(
      (capability) => capability.title === "Buat agen"
    );

    // Assert
    expect(capabilities).toHaveLength(8);
    expect(createAgents?.text).toContain("dibagikan ke tim");
    expect(createAgents?.text).toContain("instruksi sistem");
    expect(createAgents?.text).toContain("chat dengan model di OneAI");
  });

  it("uses injected capability loaders when provided", () => {
    // Setup
    const capabilityLoaders = [
      { title: () => "Title A", text: () => "Text A" }
    ];

    // Act
    const capabilities = getOneaiCapabilities({
      lang: "en",
      capabilityLoaders
    });

    // Assert
    expect(capabilities).toEqual([{ title: "Title A", text: "Text A" }]);
  });

  it("returns an empty list when no loaders are provided", () => {
    // Act
    const capabilities = getOneaiCapabilities({
      lang: "en",
      capabilityLoaders: []
    });

    // Assert
    expect(capabilities).toEqual([]);
  });
});
