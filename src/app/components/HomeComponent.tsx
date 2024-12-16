import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useProgram } from "./WalletContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PROGRAM_ID = "3UnEdKEwh6cMwp8xahE4kkhwQFc6kRvfrwiAGWVkGPeT";
const TODO_SEED = "todo_list";

interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
}

const TodoListComponent = () => {
  const { connection } = useConnection();
  const { publicKey }: any = useWallet();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const program = useProgram();

  const getTodoListPda = (): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list"), publicKey.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );
    return pda;
  };

  const fetchTasks = async () => {
    const todoListPda = getTodoListPda();
    const accountData = await program.account.todoList.fetch(todoListPda);
    console.log("accountData list-->", accountData);
    setTasks(
      accountData.tasks.map((t: any) => ({ ...t, id: t.id.toNumber() }))
    );
  };

  const initializeTodoList = async () => {
    setLoading(true);
    try {
      const todoListPda = getTodoListPda();
      console.log("Initializing Todo List with PDA:", todoListPda.toBase58());

      await program.methods
        .initialize()
        .accounts({
          todoList: todoListPda,
          authority: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Todo List initialized successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error initializing Todo List:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!description.trim()) {
      alert("Task description cannot be empty.");
      return;
    }

    setLoading(true);

    const todoListPda = getTodoListPda();

    const todoListAccount = await program.account.todoList.fetch(todoListPda);
    console.log("Todo List Owner:", todoListAccount.owner.toBase58());
    console.log("Signer:", publicKey.toBase58());

    await program.methods
      .addTask(description)
      .accounts({
        todoList: todoListPda,
        owner: publicKey,
      })
      .rpc();

    console.log("Task added:", description);
    setDescription("");
    fetchTasks();

    setLoading(false);
  };

  const completeTask = async (taskId: number) => {
    setLoading(true);

    const todoListPda = getTodoListPda();

    const todoListAccount = await program.account.todoList.fetch(todoListPda);
    console.log("Todo List Owner: and PDA:", todoListAccount.owner.toBase58(),todoListPda);
    console.log("Signer:", publicKey.toBase58());

    await program.methods
      .completeTask(new anchor.BN(taskId))
      .accounts({
        todoList: todoListPda,
        owner: publicKey,
      })
      .rpc();

    console.log("Task completed:", taskId);
    fetchTasks();

    setLoading(false);
  };

  const removeTask = async (taskId: number) => {
    setLoading(true);

    const todoListPda = getTodoListPda();

    await program.methods
      .removeTask(new anchor.BN(taskId))
      .accounts({
        todoList: todoListPda,
        owner: publicKey,
      })
      .rpc();

    console.log("Task removed:", taskId);
    fetchTasks();

    setLoading(false);
  };

  useEffect(() => {
    if (publicKey) {
      fetchTasks();
    }
  }, [publicKey]);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 p-6 bg-white shadow-lg rounded-lg w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Solana To-Do List
      </h1>

      {loading && (
   <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-green-100 bg-opacity-50 z-10">
    <div className="text-lightgreen text-lg">
      <div className="flex items-center justify-center space-x-3">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-lightgreen text-4xl"
        />
        <span>Loading...</span>
      </div>
    </div>
  </div>
)}


      {!tasks.length ? (
        <button
          onClick={initializeTodoList}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform active:scale-95"
        >
          Initialize To-Do List
        </button>
      ) : (
        <>
          <div className="w-full">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={addTask}
              className="mt-4 w-full bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform active:scale-95"
            >
              Add Task
            </button>
          </div>

          <ul className="w-full space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                  task.isCompleted ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-lg font-medium ${
                    task.isCompleted ? "text-green-800" : "text-gray-800"
                  }`}
                >
                  {task.id} - {task.description} -{" "}
                  <span
                    className={`${
                      task.isCompleted
                        ? "text-green-800 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {task.isCompleted ? "Completed" : "Pending"}
                  </span>
                </span>
                <div className="flex space-x-1">
                  {!task.isCompleted && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-green-600 hover:text-green-800 text-sm p-2 rounded"
                      title="Mark as completed"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm p-2 rounded"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TodoListComponent;
