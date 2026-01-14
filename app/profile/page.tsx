export const metadata = {
  title: "Profile - Books Shop",
  description: "View and edit your profile",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Profile</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          View and edit your account information
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-8 dark:border-white/15 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          Profile view and edit form coming soon...
        </p>
      </div>
    </div>
  );
}
