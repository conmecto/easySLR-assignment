"use client";

import { useState } from "react";
import { api } from "~/utils/api";

export default function InviteMember() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inviteMember = api.invite.inviteMember.useMutation({
    onSuccess: () => {
      setSuccess("Invitation sent successfully!");
      setEmail("");
      setError("");
    },
    onError: (error) => {
      setError(error.message);
      setSuccess("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      await inviteMember.mutateAsync({ email });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-full flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          Invite Team Member
        </h2>
      </div>
      <form className="flex flex-col mt-8 space-y-6 items-center" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="relative block w-80 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm text-center">{success}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={inviteMember.isPending}
            className="group relative flex w-40 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {inviteMember.isPending ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </form>
    </div>
  );
}