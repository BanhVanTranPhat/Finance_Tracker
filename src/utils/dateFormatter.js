// Utility functions for date formatting

export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Format time
  const timeString = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Check if it's today, yesterday, or other date
  if (targetDate.getTime() === today.getTime()) {
    return `Hôm nay, ${timeString}`;
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return `Hôm qua, ${timeString}`;
  } else {
    // Format date in Vietnamese
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}, ${timeString}`;
  }
};

export const formatDateShort = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Check if it's today, yesterday, or other date
  if (targetDate.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  } else {
    // Format date in Vietnamese
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

export const formatDateForTransaction = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Check if it's today, yesterday, or other date
  if (targetDate.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  } else {
    // Format date in Vietnamese
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // If it's the same year, don't show year
    if (year === now.getFullYear()) {
      return `${day}/${month}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }
};
