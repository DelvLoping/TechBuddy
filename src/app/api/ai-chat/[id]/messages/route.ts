import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const aiChatId = Number(params.id); // Récupérer l'ID du chat depuis les paramètres de la route

    // Vérifier que l'ID est valide
    if (isNaN(aiChatId)) {
      return NextResponse.json({ message: "Invalid chat ID" }, { status: 400 });
    }

    // Récupérer tous les messages associés à ce chat
    const messages = await prisma.aIMessage.findMany({
      where: {
        aiChatId: aiChatId,
      },
      orderBy: {
        sendDate: 'asc', // Optionnel : trier par date d'envoi croissante
      },
    });

    // Vérifier si des messages ont été trouvés
    if (!messages || messages.length === 0) {
      return NextResponse.json({ message: "No messages found" }, { status: 404 });
    }

    // Retourner les messages sous forme de réponse JSON
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
