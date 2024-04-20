"use server";
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
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
  formData: FormData,
  // addressQuery: string,
  // coordinates: [],
) {
  // const { address, date_picker, time_picker, unknown_time, longT, latT } = {
  const rawFormData = {
    // addressQuery: addressQuery,
    // coordinates: coordinates,
    srcBox: formData.get("srcBox"),
    date: formData.get("date_picker"),
    time: formData.get("time_picker"),
    unknown_time: formData.get("unknown_time"),
    day: formData.get("day"),
    nite: formData.get("nite"),
  };
  console.log(
    `>>> Server log for rawFormData:\n ${JSON.stringify(rawFormData)}`,
  );
  // revalidatePath("/natalchart");
  // redirect("/natalchart");
}

export async function createUserProfile(formData: FormData) {
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

  revalidatePath("/natalchart");
  redirect("/natalchart");
}
