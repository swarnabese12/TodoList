use anchor_lang::prelude::*;

declare_id!("3UnEdKEwh6cMwp8xahE4kkhwQFc6kRvfrwiAGWVkGPeT");

#[program]
pub mod todo_list {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTodoList>) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        todo_list.tasks = vec![];
        todo_list.owner = *ctx.accounts.authority.key;
        msg!("To-do list initialized for owner: {}", todo_list.owner);
        Ok(())
    }

    pub fn add_task(ctx: Context<ModifyTodoList>, description: String) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;

        require!(!description.is_empty(), ErrorCode::InvalidDescription);

        let task_id = todo_list.tasks.len() as u64;
        let task = Task {
            id: task_id,
            description,
            is_completed: false,
        };

        msg!(
            "Task added: {} with description: {}",
            task.id,
            task.description
        );
        todo_list.tasks.push(task);

        Ok(())
    }

    pub fn complete_task(ctx: Context<ModifyTodoList>, task_id: u64) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;

        let task = todo_list.tasks.iter_mut().find(|t| t.id == task_id);
        if let Some(task) = task {
            task.is_completed = true;
            msg!("Task marked as completed: {}", task_id);
        } else {
            return Err(ErrorCode::TaskNotFound.into());
        }
        Ok(())
    }

    pub fn remove_task(ctx: Context<ModifyTodoList>, task_id: u64) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;

        let initial_len = todo_list.tasks.len();
        todo_list.tasks.retain(|task| task.id != task_id);

        if todo_list.tasks.len() == initial_len {
            return Err(ErrorCode::TaskNotFound.into());
        }

        msg!("Task removed: {}", task_id);
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Task {
    pub id: u64,
    pub description: String,
    pub is_completed: bool,
}

#[account]
pub struct TodoList {
    pub tasks: Vec<Task>,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct InitializeTodoList<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + (4 + 64 + 1) * 10,
        seeds = [b"todo_list", authority.key().as_ref()],
        bump
    )]
    pub todo_list: Account<'info, TodoList>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyTodoList<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"todo_list", owner.key().as_ref()],
        bump
    )]
    pub todo_list: Account<'info, TodoList>,
    pub owner: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Task not found.")]
    TaskNotFound,
    #[msg("Invalid task description.")]
    InvalidDescription,
}
