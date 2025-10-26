import React, { createContext, useContext, useState, useEffect } from "react";

const GoalContext = createContext(undefined);

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoal must be used within a GoalProvider");
  }
  return context;
};

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load goals from localStorage on mount
  useEffect(() => {
    const loadGoals = () => {
      try {
        const storedGoals = localStorage.getItem("financial_goals");
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        } else {
          // Start with empty goals for new users
          setGoals([]);
        }
      } catch (error) {
        console.error("Error loading goals:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("financial_goals", JSON.stringify(goals));
    }
  }, [goals]);

  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      ...goalData,
      currentAmount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, goalData) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...goalData } : goal))
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const addContribution = (goalId, amount) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  const getGoalProgress = (goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getActiveGoals = () => {
    return goals.filter((goal) => goal.status === "active");
  };

  const getCompletedGoals = () => {
    return goals.filter((goal) => goal.status === "completed");
  };

  const getTotalTargetAmount = () => {
    return getActiveGoals().reduce((sum, goal) => sum + goal.targetAmount, 0);
  };

  const getTotalCurrentAmount = () => {
    return getActiveGoals().reduce((sum, goal) => sum + goal.currentAmount, 0);
  };

  const getTotalProgress = () => {
    const totalTarget = getTotalTargetAmount();
    const totalCurrent = getTotalCurrentAmount();
    return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  };

  const value = {
    loading,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    getGoalProgress,
    getDaysRemaining,
    getActiveGoals,
    getCompletedGoals,
    getTotalTargetAmount,
    getTotalCurrentAmount,
    getTotalProgress,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};
