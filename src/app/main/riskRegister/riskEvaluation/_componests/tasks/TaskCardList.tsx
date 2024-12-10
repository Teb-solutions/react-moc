import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { ITask } from "../../../helpers/type";
import { Alert, Button } from "@mui/material";

interface TaskCardListProps {
  tasks: ITask[];
}

const TaskCardList: React.FC<TaskCardListProps> = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8; // Number of tasks to display per page

  // Calculate the total number of pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Calculate the tasks to display based on the current page
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      {tasks.length === 0 && (
        <div className="w-full item-center py-20  justify-center bg-white ">
          <div className="flex flex-wrap justify-center">
            <Alert severity="warning" className="text-lg">
              No tasks!
            </Alert>
          </div>
        </div>
      )}
      {tasks.length > 0 && (
        <>
          <section className="grid grid-cols-2 gap-6 items-center text-sm">
            {currentTasks.map((task, index) => (
              <TaskCard
                key={task.riskRegisterId + "_" + index}
                task={task}
                index={index}
              />
            ))}
          </section>
          {/* Pagination controls */}
          <div className="flex justify-center mt-20">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "contained" : "outlined"}
                onClick={() => handlePageChange(index + 1)}
                className="mx-1"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <span className="text-xs ml-10 mt-5">
            Showing {startIndex + 1} to{" "}
            {endIndex > tasks.length ? tasks.length : endIndex} of{" "}
            {tasks.length} tasks
          </span>
        </>
      )}
    </>
  );
};

export default TaskCardList;
