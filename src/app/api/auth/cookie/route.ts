import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const exist = !!(await cookies()).get('session');
        let value = null;
        if (exist) {
            const cookie = (await cookies()).get('session');
            value = cookie?.value;
        }
        return NextResponse.json({ success: true, exist, userId: value }, { status: 200 });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Unable to process the document!" }, { status: 500 });
    }
}