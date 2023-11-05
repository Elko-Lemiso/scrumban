"use client"

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, } from "@/components/ui/card";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SignOut from "@/components/Auth/SignOut";
const tasks = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" }
];

const taskStatus = {
  requested: {
    name: "Requested",
    items: tasks
  },
  toDo: {
    name: "To do",
    items: []
  },
  inProgress: {
    name: "In Progress",
    items: []
  },
  done: {
    name: "Done",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function App() {
  const [columns, setColumns] = useState(taskStatus);
  const supabase = createClientComponentClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect('/sign-in');
  // }

  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 h-full">
      <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-800">
        <div className="text-xl font-semibold">Project Management</div>
        <div className="flex space-x-4">
          <Button variant="secondary">Add List</Button>
          <SignOut/>
        </div>
      </div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        <div className="flex overflow-x-auto px-4 py-4 h-full">
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-shrink-0 w-80 p-4 space-y-4 border border-gray-200 dark:border-gray-700 mr-4 flex flex-col h-full ${snapshot.isDraggingOver ? "bg-blue-100" : "bg-white"
                      }`}
                  >
                    <div className="text-lg font-semibold">{column.name}</div>
                    <div className="flex flex-col space-y-4 h-full">
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              className={`p-6 relative ${snapshot.isDragging ? "bg-gray-400" : "bg-gray-200"
                                }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardTitle className="text-base font-medium">
                                {item.content}
                              </CardTitle>
                              {/* Additional markup for tags or other elements can go here */}
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    <Button className="mt-4 self-start w-full text-gray-500" variant="ghost">
                      + Add Task
                    </Button>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
