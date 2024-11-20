import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../Components/UI/chart";

export const description = "A donut chart";

export function RatioPieChart() {
  // State to hold gender ratio data
  const [genderData, setGenderData] = useState<any[]>([]);

  // Fetch gender ratio data from API
  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/cases/gender-ratio"
        );
        const data = await response.json();
        setGenderData(data);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };

    fetchGenderData();
  }, []);

  // Config for the chart (you can modify colors here)
  const chartConfig = {
    male: {
      label: "Male",
      color: "hsl(var(--chart-1))", // Adjust color as needed
    },
    female: {
      label: "Female",
      color: "hsl(var(--chart-2))", // Adjust color as needed
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender Ratio - Donut</CardTitle>
        <CardDescription>Gender Distribution of Cases</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={genderData}
              dataKey="cases"
              nameKey="gender"
              innerRadius={60}
              outerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Gender distribution of cases.
        </div>
      </CardFooter>
    </Card>
  );
}
