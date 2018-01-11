import { session } from "../index";

test("Save numbers", () => {
   session.save("test-key", 99);
   expect(sessionStorage.setItem).toHaveBeenLastCalledWith("test-key", "99");
   expect(sessionStorage.__STORE__["test-key"]).toBe("99");
});