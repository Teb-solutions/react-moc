import React from "react";
import TaskCard from "./TaskCard";
import { ITask } from "../../../helpers/type";
import { Alert } from "@mui/material";

interface TaskCardListProps {
  tasks: ITask[];
}

const TaskCardList: React.FC<TaskCardListProps> = ({ tasks }) => {
  return (
    <>
      {tasks.length === 0 && (
        <div className="w-full item-center py-20  justify-center bg-white ">
          <div className="flex flex-wrap justify-center">
            <Alert severity="warning" className="text-lg">
              No tasks available!
            </Alert>
          </div>
        </div>
      )}
      {tasks.length > 0 && (
        <section className="flex flex-wrap gap-6 items-center text-sm">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.riskId + "_" + index}
              task={task}
              index={index}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default TaskCardList;
