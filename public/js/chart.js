      const salaries = <%= JSON.stringify(context.salaries) %>; // Pass salary data from backend to frontend
    
      // Categories for salary ranges (Adjust according to your salary ranges)
      const salaryCategories = {
        ">₦50,000": salaries.filter(salary => salary > 50000 && salary <= 120000).length,
        "> ₦120,000": salaries.filter(salary => salary > 120000 && salary <= 320000).length,
        "> ₦320,000": salaries.filter(salary => salary > 320000).length,
      };
    
      const ctx = document.getElementById("myChart");
    
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(salaryCategories), // Labels for the salary ranges
          datasets: [
            {
              label: "Employee's earnings",
              data: Object.values(salaryCategories), // Use the salary data in chart
              backgroundColor: [
                "rgb(242, 38, 19)",
                "rgb(54, 162, 235)",
                "rgb(46, 204, 113)",
              ],
              hoverOffset: 7,
            },
          ],
        },
      });
