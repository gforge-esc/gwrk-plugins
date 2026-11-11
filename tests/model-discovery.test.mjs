/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import assert from "node:assert/strict";
import { test } from "node:test";
import AiderAdapter from "../agents/aider/adapter.js";
import CursorAgentAdapter from "../agents/cursor-agent/adapter.js";
import OpenCodeAdapter from "../agents/opencode/adapter.js";

test("OpenCode preserves provider-qualified IDs and variants from the project catalog", async () => {
  const adapter = new OpenCodeAdapter(async (command, args, options) => {
    assert.equal(command, "opencode");
    assert.deepEqual(args, ["models"]);
    assert.equal(options.cwd, "/fixture");
    assert.ok(options.timeout > 0);
    return { stdout: "OpenCode catalog\nopenrouter/anthropic/claude-sonnet-5-5#high\nopenai/gpt-6.1-sol\n" };
  });
  const models = await adapter.discoverModels({ projectRoot: "/fixture" });
  assert.deepEqual(models.map(({ modelId, provider, family }) => ({ modelId, provider, family })), [
    { modelId: "openrouter/anthropic/claude-sonnet-5-5#high", provider: "anthropic", family: "claude" },
    { modelId: "openai/gpt-6.1-sol", provider: "openai", family: "gpt" },
  ]);
});

test("Aider asks for a provider prefix and reads qualified IDs from catalog output", async () => {
  const calls = [];
  const adapter = new AiderAdapter(async (command, args) => {
    calls.push([command, ...args]);
    return {
      stdout: args[1] === "openai/"
        ? 'Models which match "openai/":\n- gpt-6.1-sol (openai/gpt-6.1-sol)\n'
        : "",
    };
  });
  const models = await adapter.discoverModels({ projectRoot: "/fixture" });
  assert.ok(calls.some((call) => call.join(" ") === "aider --list-models openai/"));
  assert.equal(models.length, 1);
  assert.equal(models[0].modelId, "openai/gpt-6.1-sol");
});

test("Cursor uses a supported non-interactive list flag and excludes Auto", async () => {
  const calls = [];
  const adapter = new CursorAgentAdapter(async (command, args) => {
    calls.push([command, ...args]);
    return {
      stdout: args[0] === "--help"
        ? "  --list-models   List available models\n"
        : "Available models:\n- auto (Auto)\n- claude-opus-5-5 (Claude Opus)\n",
    };
  });
  const models = await adapter.discoverModels();
  assert.deepEqual(calls, [["cursor-agent", "--help"], ["cursor-agent", "--list-models"]]);
  assert.deepEqual(models.map(({ modelId }) => modelId), ["claude-opus-5-5"]);
});

test("older Cursor versions defer to explicit candidates without starting an agent", async () => {
  const adapter = new CursorAgentAdapter(async (_command, args) => {
    assert.deepEqual(args, ["--help"]);
    return { stdout: "Commands:\n  agent [prompt...]  Start Cursor\n" };
  });
  assert.deepEqual(await adapter.discoverModels(), []);
});

for (const Adapter of [AiderAdapter, CursorAgentAdapter, OpenCodeAdapter]) {
  test(`${Adapter.name} forwards the pinned ID and exact workflow payload`, () => {
    const adapter = new Adapter();
    const request = { model: "example/exact-model", stdin: "probe instructions" };
    const dispatch = adapter.dispatch(request);
    assert.equal(adapter.supportsModelForwarding, true);
    assert.equal(dispatch.args[dispatch.args.indexOf("--model") + 1], request.model);
    assert.equal(dispatch.stdin, request.stdin);
  });
}
