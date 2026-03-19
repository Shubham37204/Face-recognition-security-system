import React, { useEffect } from 'react';

const CounterAnimation = () => {
  useEffect(() => {
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const animateCounter = (counter) => {
      const targetValue = parseInt(counter.dataset.val);
      let currentValue = 0;
      const increment = Math.ceil(targetValue / 100);

      const interval = setInterval(() => {
        counter.textContent = currentValue.toLocaleString();
        currentValue += increment;

        if (currentValue >= targetValue) {
          counter.textContent = targetValue.toLocaleString();
          clearInterval(interval);
        }
      }, 10);
    };

    const handleScroll = () => {
      const counters = document.querySelectorAll('.num');

      counters.forEach((counter) => {
        if (isInViewport(counter) && !counter.dataset.animated) {
          animateCounter(counter);
          counter.dataset.animated = true;
        } else if (Math.abs(window.scrollY - counter.offsetTop) > 2000 && counter.dataset.animated) {
          counter.textContent = "000";
          counter.dataset.animated = false;
          animateCounter(counter);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style = {{marginTop : "15pc"}} className="counter-wrapper bg-gray-800 text-white py-10 mb-4">
      <div className="wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {[
          { label: 'Our Branches', value: 122 },
          { label: 'Happy Customers', value: 805 },
          { label: 'Website Visited', value: 2522 },
          { label: 'Five Stars', value: 746 }
        ].map(({ label, value }, index) => (
          <div key={index} className="contain flex flex-col items-center p-4 bg-gray-900 rounded-lg">
            <span className="num text-4xl font-bold" data-val={value}>000</span>
            <span className="text text-lg">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterAnimation;