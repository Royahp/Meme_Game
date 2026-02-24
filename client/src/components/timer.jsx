import React, { useEffect } from 'react';
function Timer({ initialTime, isActive, onTimeChange }) {
    useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          onTimeChange((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);
      } else {
        clearInterval(interval);
      }
  
      return () => clearInterval(interval); // این خط مطمئن می‌شود که هنگام unmount شدن کامپوننت، interval پاک شود
    }, [isActive, onTimeChange]);
  
    return (
      <div>
        Time left: {initialTime}
      </div>
    );
  }
  export default Timer