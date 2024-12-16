// import BN from "bn.js";
// import assert from "assert";
// import * as web3 from "@solana/web3.js";
// import * as anchor from "@coral-xyz/anchor";
// import type { TodoList } from "../target/types/todo_list";
// describe("todo_list", async () => {
//   // Configure the client to use the local cluster
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.TodoList as anchor.Program<TodoList>;
  
//   let program: any = program;
//   let authority: any = pg.wallet;
//   let todoListPda: anchor.web3.PublicKey;
//   let bump: number;
//   [todoListPda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("todo_list"), authority.publicKey.toBuffer()],
//     program.programId
//   );
//   // it("Initializes a to-do list", async () => {

//   //   console.log("todoListPda:", todoListPda.toString());
//   //   console.log("authority.publicKey:", authority.publicKey.toString());
//   //   console.log("program.programId:", program.programId.toString());
//   //   await program.methods
//   //     .initialize()
//   //     .accounts({
//   //       todoList: todoListPda,
//   //       authority: authority.publicKey,
//   //       systemProgram: anchor.web3.SystemProgram.programId,
//   //     })
//   //     .signers([authority])
//   //     .rpc();
//   //   // Fetch the to-do list account
//   //   const todoListAccount = await program.account.todoList.fetch(todoListPda);
//   //   console.log("To-Do List Account created successfully:", todoListAccount);
//   //   assert.ok(todoListAccount.owner.equals(authority.publicKey));
//   //   assert.ok(todoListAccount.tasks.length === 0);
//   // });
//   it("Adds a task", async () => {
//     const description = "Clean Dishes";
//     await program.methods
//       .addTask(description)
//       .accounts({
//         todoList: todoListPda,
//         owner: authority.publicKey,
//       })
//       .rpc();
//     const todoListAccount = await program.account.todoList.fetch(todoListPda);
//     //console.log("To-Do List Account:", todoListAccount.tasks);
//     console.log(
//       "To-Do List Account:",
//       todoListAccount.tasks,
//       "List LEngth is :",
//       todoListAccount.tasks.length,
//       "To-Do List PDA Address:",
//       todoListPda.toBase58()
//     );
//     // assert.equal(todoListAccount.tasks.length, 1);
//     // assert.equal(todoListAccount.tasks[0].description, description);
//     // assert.equal(todoListAccount.tasks[0].isCompleted, false);
//   });
//   // it("Completes a task", async () => {
//   //   const taskId = new anchor.BN(0);
//   //   await program.methods
//   //     .completeTask(taskId)
//   //     .accounts({
//   //       todoList: todoListPda,
//   //       owner: authority.publicKey,
//   //     })
//   //     .rpc();
//   //   const todoListAccount = await program.account.todoList.fetch(todoListPda);
//   //   assert.equal(todoListAccount.tasks[0].isCompleted, true);
//   //   console.log(
//   //     "To-Do List Account:",
//   //     todoListAccount.tasks,
//   //     "List LEngth is :",
//   //     todoListAccount.tasks.length
//   //   );
//   // });
//   // it("Removes a task", async () => {
//   //   //const taskId: any = 0;
//   //   const taskId = new anchor.BN(3);
//   //   await program.methods
//   //     .removeTask(taskId)
//   //     .accounts({
//   //       todoList: todoListPda,
//   //       owner: authority.publicKey,
//   //     })
//   //     .rpc();
//   //   const todoListAccount = await program.account.todoList.fetch(todoListPda);
//   //   console.log(
//   //     "To-Do List Account:",
//   //     todoListAccount.tasks,
//   //     "List LEngth is :",
//   //     todoListAccount.tasks.length,
//   //     "To-Do List PDA Address:",
//   //     todoListPda.toBase58()
//   //   );
//   //   //   // assert.equal(todoListAccount.tasks.length, 0);
//   // });
// });
