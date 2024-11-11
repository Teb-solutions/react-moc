import React from "react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  severityScore: number;
  risk: number;
  description: string;
}

interface TaskCardListProps {
  tasks: Task[];
}

const TaskCardList: React.FC<TaskCardListProps> = ({ tasks }) => {
  return (
    <section className="flex flex-wrap gap-6 items-center text-sm">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          id={task.id}
          severityScore={task.severityScore}
          risk={task.risk}
          description={task.description}
          highlighted={index === 0}
        />
      ))}
    </section>
  );
};

export default TaskCardList;
