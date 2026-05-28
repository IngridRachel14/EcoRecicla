"use client"
import { useEffect, useState } from 'react';
import React from "react";
import { motion } from "framer-motion";

type User = {
  name: string;
  points: number;
};

const mockTopUsers: User[] = [
  { name: "Pulipeli", points: 1500 },
  { name: "Terranova", points: 750 },
  { name: "Elmejor", points: 300 },
];

// se ordenan por puntos y asignamos posiciones dinámicamente
const sortedUsers = mockTopUsers
  .sort((a, b) => b.points - a.points)
  .map((user, index) => ({
    ...user,
    position: index + 1,
  }));

const userRank = {
  position: 8,
  name: "Numero 8",
  points: 55,
  isCurrentUser: true,
};

const Ranking = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-sm mx-auto mt-10 rounded-2xl border-4 border-gray-400 p-4 shadow-md bg-white"
    >
      <h2 className="text-center font-bold text-lg">Ranking</h2>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="flex flex-col items-center my-4"
      >
        <div className="text-sm text-center">
          <div className="font-semibold">{userRank.name}</div>
          <div className="text-gray-500 text-xs">{userRank.points} pts</div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {sortedUsers.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`flex justify-between items-center px-4 py-2 rounded-full text-white font-bold ${
              user.position === 1
                ? "bg-yellow-400"
                : user.position === 2
                ? "bg-cyan-400"
                : "bg-red-400"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {user.position}
              </span>
              {user.name}
            </span>
            <span>{user.points}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Ranking;
