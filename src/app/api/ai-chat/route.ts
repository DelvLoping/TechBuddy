// // // src/app/api/ai-chat/route.ts

// // import { NextRequest, NextResponse } from "next/server";
// // import prisma from "@/lib/prisma";
// // import { authenticate } from "../middleware";
// // import { ADMIN } from "@/constant";

// // export async function GET(req: NextRequest) {
// //   try {
// //     const authFailed = await authenticate(req);
// //     if (authFailed) {
// //       return authFailed;
// //     }
// //     const user = req.user;

// //     let aiChats;

// //     if (user.type === ADMIN) {
// //       aiChats = await prisma.aIChat.findMany();
// //     } else {
// //       aiChats = await prisma.aIChat.findMany({
// //         where: {
// //           userId: user.id,
// //         },
// //       });
// //     }

// //     return NextResponse.json({ aiChats }, { status: 200 });
// //   } catch (error) {
// //     console.error("Error fetching AI chats:", error);
// //     return NextResponse.json(
// //       { message: "Something went wrong" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     const authFailed = await authenticate(req);
// //     if (authFailed) {
// //       return authFailed;
// //     }

// //     const { question, answer } = await req.json();
// //     const user = req.user;

// //     if (!question || !answer) {
// //       return NextResponse.json(
// //         { message: "Question and answer are required" },
// //         { status: 400 }
// //       );
// //     }

// //     const aiChat = await prisma.aIChat.create({
// //       data: {
// //         userId: user.id,
// //         question,
// //         answer,
// //       },
// //     });

// //     return NextResponse.json({ aiChat }, { status: 201 });
// //   } catch (error) {
// //     console.error("Error creating AI chat:", error);
// //     return NextResponse.json(
// //       { message: "Something went wrong" },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { authenticate } from "../middleware";
// import { ADMIN } from "@/constant";

// export async function GET(req: NextRequest) {
//   try {
//     const authFailed = await authenticate(req);
//     if (authFailed) {
//       console.error("Échec de l'authentification"); // Log d'erreur pour l'authentification
//       return authFailed;
//     }
//     const user = req.user;

//     console.log("Utilisateur authentifié :", user); // Log des informations utilisateur

//     let aiChats;

//     if (user.type === ADMIN) {
//       aiChats = await prisma.aIChat.findMany();
//     } else {
//       aiChats = await prisma.aIChat.findMany({
//         where: {
//           userId: user.id,
//         },
//       });
//     }

//     console.log("Chats récupérés :", aiChats); // Log des chats récupérés

//     return NextResponse.json({ aiChats }, { status: 200 });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des chats :", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const authFailed = await authenticate(req);
//     if (authFailed) {
//       console.error("Échec de l'authentification"); // Log d'échec de l'authentification
//       return authFailed;
//     }

//     const { question, answer } = await req.json();
//     const user = req.user;

//     console.log("Données reçues :", { question, answer, user }); // Log des données reçues

//     if (!question || !answer) {
//       console.error("Données invalides : question ou réponse manquante");
//       return NextResponse.json(
//         { message: "Question and answer are required" },
//         { status: 400 }
//       );
//     }

//     // Création de l'enregistrement dans Prisma
//     const aiChat = await prisma.aIChat.create({
//       data: {
//         userId: user.id,
//         question,
//         answer,
//       },
//     });

//     console.log("Chat créé avec succès :", aiChat); // Log de la création réussie

//     return NextResponse.json({ aiChat }, { status: 201 });
//   } catch (error) {
//     console.error("Erreur lors de la création du chat :", error); // Log de l'erreur lors de la création
//     return NextResponse.json(
//       { message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { ADMIN } from "@/constant";

// Récupérer tous les chats AI d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      console.error("Échec de l'authentification");
      return authFailed;
    }

    const user = req.user;

    let aiChats;

    if (user.type === ADMIN) {
      aiChats = await prisma.aIChat.findMany();
    } else {
      aiChats = await prisma.aIChat.findMany({
        where: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ aiChats }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des chats :", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Créer un nouveau chat AI avec des messages utilisateur et IA
export async function POST(req: NextRequest) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      console.error("Échec de l'authentification");
      return authFailed;
    }

    const { question, answer } = await req.json();
    const user = req.user;

    console.log("Données reçues :", { question, answer, user });

    if (!question || !answer) {
      console.error("Données invalides : question ou réponse manquante");
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Créez d'abord un AIChat
    const aiChat = await prisma.aIChat.create({
      data: {
        userId: user.id,
      },
    });

    // Ensuite, ajoutez les messages à l'AIChat
    await prisma.aIMessage.createMany({
      data: [
        {
          aiChatId: aiChat.id,
          sender: 'USER', // Stocke la question en tant qu'utilisateur
          content: question,
        },
        {
          aiChatId: aiChat.id,
          sender: 'AI', // Stocke la réponse générée par l'IA
          content: answer,
        },
      ],
    });

    console.log("Chat créé avec succès :", aiChat);

    return NextResponse.json({ aiChat }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du chat :", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
