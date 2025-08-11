import { getAll } from "../getAll";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("users - getAll", () => {
  const mockDbAll = vi.fn();
  const ctx = {
    globals: {
      db: {
        all: mockDbAll,
      },
    },
  } as any;

  const departmentId = 42;
  const dbResult = [
    { ID: 1, RISK: 0.5, DEPARTMENT_ID: 1 },
    { ID: 2, RISK: 0.8, DEPARTMENT_ID: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves with mapped users when db returns results", async () => {
    mockDbAll.mockImplementation((_query, _params, cb) => cb(null, dbResult));

    const result = await getAll(ctx, { departmentId });

    expect(mockDbAll).toHaveBeenCalledWith(
      "SELECT * FROM user WHERE department_id = ?",
      [departmentId],
      expect.any(Function)
    );
    expect(result).toEqual([
      { id: 1, risk: 0.5, departmentId: 1 },
      { id: 2, risk: 0.8, departmentId: 1 },
    ]);
  });

  it("rejects when db returns error", async () => {
    const error = new Error("DB error");
    mockDbAll.mockImplementation((_query, _params, cb) => cb(error, null));

    await expect(getAll(ctx, { departmentId })).rejects.toThrow("DB error");
  });

  it("resolves with empty array if db returns empty result", async () => {
    mockDbAll.mockImplementation((_query, _params, cb) => cb(null, []));

    const result = await getAll(ctx, { departmentId });
    expect(result).toEqual([]);
  });
});
