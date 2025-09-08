import { auth, currentUser } from "@clerk/nextjs/server";
import snap from "@/lib/midtrans";
import { redirect } from "next/navigation";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return redirect("/sign-in");
    // }

    const user = await currentUser();

    const body = await req.json();
    const orderId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    body.transaction_details.order_id = orderId;

    body.customer_details = {
      first_name: user?.firstName || "User",
      last_name: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "guest@example.com",
    };

    const transaction = await snap.createTransaction(body);

    return Response.json(
      {
        message: "Success",
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Failed to create transaction",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
