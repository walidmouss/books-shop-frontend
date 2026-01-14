#!/usr/bin/env node

/**
 * Test script to verify delete functionality works correctly
 */

async function testDelete() {
  const baseUrl = "http://localhost:3000";

  try {
    console.log("🧪 Testing delete functionality...\n");

    // Step 1: Fetch initial books list
    console.log("1️⃣  Fetching books list...");
    let res = await fetch(`${baseUrl}/api/books?page=1&pageSize=20`);
    let data = await res.json();
    const initialCount = data.total;
    console.log(`   ✓ Found ${initialCount} books`);

    // Find a book to delete (one authored by Admin User)
    const bookToDelete = data.items.find((b) => b.author === "Admin User");
    if (!bookToDelete) {
      console.error("   ✗ No book found with author='Admin User'");
      process.exit(1);
    }
    console.log(`   ✓ Found book to delete: "${bookToDelete.title}" (id: ${bookToDelete.id})`);

    // Step 2: Delete the book
    console.log("\n2️⃣  Deleting book...");
    res = await fetch(`${baseUrl}/api/books/${bookToDelete.id}`, {
      method: "DELETE",
    });
    console.log(`   Response status: ${res.status}`);
    if (!res.ok) {
      throw new Error("Delete failed: " + res.status);
    }
    const deleteResult = await res.json();
    console.log(`   ✓ Delete successful:`, deleteResult);

    // Step 3: Fetch books list again
    console.log("\n3️⃣  Fetching books list again...");
    res = await fetch(`${baseUrl}/api/books?page=1&pageSize=20`);
    data = await res.json();
    const newCount = data.total;
    console.log(`   ✓ Now have ${newCount} books`);

    // Step 4: Verify book is gone
    console.log("\n4️⃣  Verifying book was deleted...");
    const deletedBook = data.items.find((b) => b.id === bookToDelete.id);
    if (deletedBook) {
      console.error(`   ✗ Book still exists in list!`);
      process.exit(1);
    }
    console.log(`   ✓ Book successfully removed from list`);

    // Step 5: Try to fetch deleted book directly
    console.log("\n5️⃣  Trying to fetch deleted book directly...");
    res = await fetch(`${baseUrl}/api/books/${bookToDelete.id}`);
    console.log(`   Response status: ${res.status}`);
    if (res.status === 404) {
      console.log(`   ✓ Book returns 404 (correct)`);
    } else {
      console.error(`   ✗ Expected 404, got ${res.status}`);
      process.exit(1);
    }

    console.log(`\n✅ All tests passed! Delete functionality is working correctly.\n`);
  } catch (error) {
    console.error(`\n❌ Test failed:`, error.message);
    process.exit(1);
  }
}

testDelete();
