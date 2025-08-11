import { getAll } from "../getAllDepartments";
import { Department } from "../../../../models/department";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("departments - getAllDepartments", () => {
  const mockDepartments: Department[] = [
    { id: 1, name: "HR" },
    { id: 2, name: "Engineering" },
  ];

  let ctx: any;

  beforeEach(() => {
    ctx = {
      globals: {
        db: {
          all: vi.fn(),
        },
      },
    };
  });

  it("should resolve with departments on success", async () => {
    ctx.globals.db.all.mockImplementation((_query, _params, cb) => {
      cb(null, mockDepartments);
    });

    await expect(getAll(ctx, undefined)).resolves.toEqual(mockDepartments);
    expect(ctx.globals.db.all).toHaveBeenCalledWith(
      "SELECT * FROM department",
      [],
      expect.any(Function)
    );
  });

  it("should reject with error on db failure", async () => {
    const error = new Error("DB error");
    ctx.globals.db.all.mockImplementation((_query, _params, cb) => {
      cb(error, null);
    });

    await expect(getAll(ctx, undefined)).rejects.toThrow("DB error");
  });
});
