import { test, expect } from "@playwright/test";

test("user can sign up, create room, change it and delete it", async ({
  page,
}) => {
  // Generate unique identifiers based on the current timestamp
  const uniqueId = Date.now();
  const uniqueEmail = `test_${uniqueId}@gmail.com`;
  const uniqueRoomName = `Room_${uniqueId}`;
  const updatedRoomName = `Updated_${uniqueId}`;

  await page.goto("http://localhost:5444/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByRole("textbox", { name: "Name" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("Joe Mama");

  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(uniqueEmail); // Unique email

  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("testtest");
  await page.getByRole("button", { name: "Sign up" }).click();

  await page.getByRole("button", { name: "New room" }).click();

  await page.getByRole("textbox", { name: "Name" }).fill(uniqueRoomName); // Unique room name
  await page.getByRole("textbox", { name: "Description" }).click();
  await page
    .getByRole("textbox", { name: "Description" })
    .fill("test description");
  await page.getByRole("button", { name: "Create room" }).click();

  // Click your newly created room using its unique name instead of a hardcoded "test"
  await page.getByRole("link", { name: new RegExp(uniqueRoomName) }).click();

  await page.getByRole("button", { name: "Edit room" }).click();
  await page.getByRole("textbox", { name: "Name" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill(updatedRoomName); // Unique updated name
  await page.getByRole("button", { name: "Save changes" }).click();

  await page.getByRole("button", { name: "New booking" }).click();
  await page.getByRole("textbox", { name: "Description" }).fill("test booking");
  await page.getByRole("textbox", { name: "Start" }).fill("2026-10-24T16:45");
  await page.getByRole("textbox", { name: "End" }).fill("2026-10-29T16:45");
  await page.getByRole("button", { name: "Create booking" }).click();

  await page.getByRole("button", { name: "Cancel booking" }).click();
  await page.getByRole("button", { name: "Cancel booking" }).click();

  await page.getByRole("button", { name: "Delete room" }).click();
  await page.getByRole("button", { name: "Delete room" }).click();
});
