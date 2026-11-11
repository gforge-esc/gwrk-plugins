import assert from "node:assert/strict";
import test from "node:test";
import { GooseAdapter } from "../agents/goose/adapter.js";

const adapter = new GooseAdapter();

test("passes the selected model to the Goose CLI", () => {
  const model = "ollama/qwen:fixture";
  const spec = adapter.dispatch({
    model,
    prompt: "Run the implementation checks.",
    stdin: "Project context",
    env: { GOOSE_PROVIDER: "ollama" },
  });

  assert.equal(spec.command, "goose");
  assert.deepEqual(spec.args, [
    "run", "--with-builtin", "developer", "-i", "-", "--model", model,
  ]);
  assert.equal(spec.stdin, "Project context\n\nRun the implementation checks.");
  assert.deepEqual(spec.env, { GOOSE_PROVIDER: "ollama" });
});

test("uses Goose configuration for the default route", () => {
  for (const model of [undefined, "default"]) {
    const spec = adapter.dispatch({ model, prompt: "Review the changes." });
    assert.deepEqual(spec.args, ["run", "--with-builtin", "developer", "-i", "-"]);
    assert.equal(spec.stdin, "Review the changes.");
  }
});
