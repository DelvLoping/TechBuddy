"use client";

import { getFullNames } from "@/utils";
import { Avatar, Button, Card } from "@nextui-org/react";
import { useSelector } from "react-redux";

export default function Dashboard() {
  // Example dummy data
  const helpRequests = [
    {
      id: 1,
      subject: "Problème de connexion Internet",
      description: "Je n'arrive pas à me connecter au réseau Wi-Fi.",
      date: "2024-09-03",
      status: "En attente",
    },
    {
      id: 2,
      subject: "Mise à jour de Windows",
      description: "Je ne sais pas comment mettre à jour mon ordinateur.",
      date: "2024-09-02",
      status: "Acceptée",
    },
  ];

  const userReducer = useSelector((state) => state.user);
  const { user } = userReducer || {};
  const { lastname, firstname, email, age, type } = user || {};
  const fullname = getFullNames(user);
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex flex-col gap-8 w-full">
        {/* Profil rapide */}
        <div className="w-full flex flex-row justify-center">
          <Card>
            <div className="p-4 text-center flex flex-col items-center">
              <Avatar
                text={`${firstname?.[0]}${lastname?.[0]}`}
                size="xl"
                className="mb-4"
              />
              <h3 className="text-xl font-bold">{fullname}</h3>
              <p>{email}</p>
              <p className="text-primary">{type}</p>
              {age && <p className="text-secondary">{age} years old</p>}
            </div>
          </Card>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-center gap-4">
          {/* Liste des demandes en cours */}
          <div className="w-full sm:w-2/3 md:w-3/4">
            <Card>
              <div className="p-4">
                <h3 className="text-2xl font-bold mb-4">Demandes en cours</h3>
                {helpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border-b border-gray-300 last:border-none"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-semibold">
                        {request.subject}
                      </h4>
                      <p className="text-sm text-gray-500">{request.date}</p>
                    </div>
                    <p className="mt-2">{request.description}</p>
                    <p className="mt-2">
                      Statut :{" "}
                      <span
                        className={`${
                          request.status === "En attente"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Liste des demandes en cours */}
          <div className="w-full sm:w-1/3 md:w-1/4">
            <Card>
              <div className="p-4">
                <h3 className="text-2xl font-bold mb-4">Demandes en cours</h3>
                {helpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border-b border-gray-300 last:border-none"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-semibold">
                        {request.subject}
                      </h4>
                      <p className="text-sm text-gray-500">{request.date}</p>
                    </div>
                    <p className="mt-2">{request.description}</p>
                    <p className="mt-2">
                      Statut :{" "}
                      <span
                        className={`${
                          request.status === "En attente"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
