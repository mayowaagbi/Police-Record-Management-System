"use client";

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
  // State to hold gender ratio data, with default values
  const [genderData, setGenderData] = useState([
    { gender: "MALE", cases: 50 },
    { gender: "FEMALE", cases: 50 },
  ]);

  // Fetch gender ratio data from API
  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/cases/gender-ratio"
        );
        const data = await response.json();

        // Check if data is valid and not empty
        if (Array.isArray(data) && data.length > 0) {
          setGenderData(data);
        } else {
          console.warn("No data received, using default values.");
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };

    fetchGenderData();
  }, []);

  // Config for the chart (you can modify colors here)
  const chartConfig = {
    male: {
      label: "MALE",
      // color: "hsl(var(--chart-8))",
      color: "red", // Adjust color as needed
    },
    female: {
      label: "FEMALE",
      color: "hsl(var(--chart-2))", // Adjust color as needed
    },
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender Ratio - Donut</CardTitle>
        <CardDescription>Gender Distribution of Cases</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square align-middle max-h-[250px] w-full"
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
              fill="var(--color-desktop)" // Optional: set fill color for the pie chart
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Gender distribution of cases.
        </div>
      </CardFooter> */}
    </Card>
  );
}
