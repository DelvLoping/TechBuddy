import React from "react";

export default function HelpRequestList({ helpRequests }) {
  return (
    <div>
      {helpRequests !== null ? (
        <ul className="space-y-4">
          {helpRequests.map((request) => (
            <li key={request.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{request.subject}</h2>
              <p>{request.description}</p>
              <p><strong>Intervention Type:</strong> {request.interventionType}</p>
              <p><strong>Intervention Date:</strong> {new Date(request.interventionDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Reward:</strong> {request.reward}</p>
              {request.interventionType === "IN_PERSON" && request.interventionAddressId && (
                <>
                  <p><strong>Address:</strong></p>
                  <p>{request.interventionAddress?.street || "Street not provided"}</p>
                  <p>
                    {request.interventionAddress?.city || "City not provided"}, {request.interventionAddress?.postalCode || "Postal Code not provided"}, {request.interventionAddress?.country || "Country not provided"}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No help requests found.</p>
      )}
    </div>
  );
}
