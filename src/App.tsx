import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { TodoItem } from './components/TodoItem';
import { TodoInput } from './components/TodoInput';
import { Todo } from './types/todo';
import { supabase } from './lib/supabase';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text, completed: false }])
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo?.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Get the todo before deleting
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      // Insert into deleted_tasks
      const { error: archiveError } = await supabase
        .from('deleted_tasks')
        .insert([{
          task_id: todo.id,
          text: todo.text,
          completed: todo.completed,
          created_at: todo.created_at
        }]);

      if (archiveError) throw archiveError;

      // Delete from todos
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
          </div>
          
          <TodoInput onAdd={addTodo} />

          {loading ? (
            <div className="mt-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="mt-8 space-y-3">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>

              {todos.length > 0 && (
                <div className="mt-6 text-sm text-gray-500">
                  {completedCount} of {todos.length} tasks completed
                </div>
              )}

              {todos.length === 0 && (
                <div className="mt-8 text-center text-gray-500">
                  No todos yet. Add one above!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
