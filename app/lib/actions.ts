"use server";
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import { Schema, model, connect } from "mongoose";

// import {NatalChartUserSchema} from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// const FormSchema = z.object({
//     id: z.string(),
//     customerId: z.string(),
//     amount: z.coerce.number(),
//     status: z.enum(['pending', 'paid']),
//     date: z.string(),
//   });

// const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createNatalChart(
  addressQuery: string,
  resLongitude: string,
  resLattitude: string,
  formData: FormData,
) {
  // await connect(`${process.env.MONGO_URI}`);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');`
  //if your database has auth enabled

  // const natalchartSchema = new Schema(NatalChartUserSchema);

  const rawFormData = {
    addressQuery: addressQuery,
    resLongitude: parseInt(resLongitude),
    resLattitude: parseInt(resLattitude),
    // srcBox: formData.get("srcBox"),
    longitude: formData.get("longitude"),
    lattitude: formData.get("lattitude"),
    date: formData.get("date_picker"),
    time: formData.get("time_picker"),
    unknown_time: formData.get("unknown_time"),
    day: formData.get("day"),
    nite: formData.get("nite"),
  };
  console.log(
    `>>> Server log for rawFormData:\n ${JSON.stringify(rawFormData)}`,
  );
  // to check to adjust app comportement on submittion
  revalidatePath("/natalchart");
  redirect("/natalchart");
}

// export async function createUserProfile() {
  //   const rawFormData = {
  //     customerId: formData.get('name'),
  //     amount: formData.get('lastName'),
  //     status: formData.get('status'),
  //   };
  // Test it out:
  // console.log(rawFormData);
  // console.log(typeof rawFormData.amount);
  //   const { customerId, amount, status } = CreateInvoice.parse({
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  //   });

  // It's usually good practice to store monetary values in cents in your database
  // to eliminate JavaScript floating-point errors and ensure greater accuracy.
  // Let's convert amount into cents..

  //   const amountInCents = amount * 100;
  // create a new date with the format "YYYY-MM-DD" for the invoice's creation date
  //   const date = new Date().toISOString().split('T')[0];

  //   const rawFormData = {
  //       customerId,
  //       amountInCents,
  //       status,
  //       date
  //   };

  //   console.log(rawFormData);

  //   try{
  //     await sql`
  //     INSERT INTO invoices (customer_id, amount, status, date)
  //     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  //     `;

  //   }catch(error){
  //     console.log(error);
  //     return {
  //       message: 'Database Error: Failed to Create Invoice.',
  //     };
  //   }

//   revalidatePath("/natalchart");
//   redirect("/natalchart");
// }
