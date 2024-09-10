// // Ce qui marche 07/09/2024

// // src/app/api/ai-chat/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { authenticate } from "../../middleware";
// import { ADMIN } from "@/constant";

// // model AIChat {
// //   id           Int         @id @default(autoincrement())
// //   userId       Int
// //   creationDate DateTime    @default(now())
// //   user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
// //   messages     AIMessage[]
// // }

// // model AIMessage {
// //   id       Int           @id @default(autoincrement())
// //   aiChatId Int
// //   sender   MessageSender
// //   content  String
// //   sendDate DateTime      @default(now())
// //   aiChat   AIChat        @relation(fields: [aiChatId], references: [id], onDelete: Cascade)
// // }

// export async function GET(req: NextRequest, { params }) {
//   try {
//     const { id } = params;
//     const authFailed = await authenticate(req);
//     if (authFailed) {
//       return authFailed;
//     }

//     const aiChat = await prisma.aIChat.findUnique({
//       where: {
//         id: Number(id),
//       },
//     });

//     if (!aiChat) {
//       return NextResponse.json(
//         { message: "AI Chat not found" },
//         { status: 404 }
//       );
//     }
//     if (req.user.type !== ADMIN && req.user.id !== aiChat.userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.json({ aiChat }, { status: 200 });
//   } catch (error) {
//     console.error("Error getting AI Chat:", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: error.status || 500 }
//     );
//   }
// }

// export async function PUT(req: NextRequest, { params }) {
//   try {
//     const { id } = params;
//     const authFailed = await authenticate(req);
//     if (authFailed) {
//       return authFailed;
//     }

//     const { messages } = await req.json();
//     const oldAIChat = await prisma.aIChat.findUnique({
//       where: {
//         id: Number(id),
//       },
//       select: {
//         userId: true,
//       },
//     });
//     if (!oldAIChat) {
//       return NextResponse.json(
//         { message: "AI Chat not found" },
//         { status: 404 }
//       );
//     }
//     if (oldAIChat.userId !== req.user.id && req.user.type !== ADMIN) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const aiChat = await prisma.aIChat.update({
//       where: {
//         id: Number(id),
//       },
//       data: {
//         messages: {
//           create: messages,
//         },
//       },
//     });

//     return NextResponse.json({ aiChat }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating AI Chat:", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: error.status || 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }) {
//   try {
//     const { id } = params;
//     const authFailed = await authenticate(req);
//     if (authFailed) {
//       return authFailed;
//     }

//     const aiChat = await prisma.aIChat.findUnique({
//       where: {
//         id: Number(id),
//       },
//       select: {
//         userId: true,
//       },
//     });

//     if (!aiChat) {
//       return NextResponse.json(
//         { message: "AI Chat not found" },
//         { status: 404 }
//       );
//     }
//     if (aiChat.userId !== req.user.id && req.user.type !== ADMIN) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     await prisma.aIChat.delete({
//       where: {
//         id: Number(id),
//       },
//     });

//     return NextResponse.json({ message: "AI Chat deleted" }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting AI Chat:", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: error.status || 500 }
//     );
//   }
// }

// src/app/api/ai-chat/[id]/route.ts


// // qui marche 17h27
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN } from "@/constant";

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const aiChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!aiChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (req.user.type !== ADMIN && req.user.id !== aiChat.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ aiChat }, { status: 200 });
  } catch (error) {
    console.error("Error getting AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { title } = await req.json();
    console.log('Title received from request:', title);  // Debugging

    const oldAIChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
        title: true,
      },
    });
    if (!oldAIChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (oldAIChat.userId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (title && !oldAIChat.title) {
      const updatedAIChat = await prisma.aIChat.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
        },
      });
      console.log('Title successfully updated to:', title);
      return NextResponse.json({ aiChat: updatedAIChat }, { status: 200 });
    }

    return NextResponse.json({ message: "No title update necessary" }, { status: 200 });
  } catch (error) {
    console.error("Error updating AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const aiChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });

    if (!aiChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (aiChat.userId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.aIChat.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ message: "AI Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

