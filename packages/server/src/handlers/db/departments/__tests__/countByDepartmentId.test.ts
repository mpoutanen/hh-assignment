import { describe, it, expect, beforeEach, vi } from "vitest";
import { countById } from "../countByDepartmentId";

describe("departments - countById", () => {
  const mockDbGet = vi.fn();
  const ctx = {
    globals: {
      db: {
        get: mockDbGet,
      },
    },
  } as any;

  beforeEach(() => {
    mockDbGet.mockReset();
  });

  it("resolves with the count when db.get succeeds", async () => {
    mockDbGet.mockImplementation((_sql, _params, cb) => {
      cb(null, { count: 5 });
    });

    await expect(countById(ctx, 1)).resolves.toBe(5);
    expect(mockDbGet).toHaveBeenCalledWith(
      "SELECT COUNT(*) as count FROM user WHERE department_id = ?",
      [1],
      expect.any(Function)
    );
  });

  it("rejects with error when db.get fails", async () => {
    const error = new Error("DB error");
    mockDbGet.mockImplementation((_sql, _params, cb) => {
      cb(error, undefined);
    });

    await expect(countById(ctx, 99)).rejects.toThrow("DB error");
  });
});
