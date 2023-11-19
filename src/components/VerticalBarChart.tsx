import {useState, useEffect} from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import {faker} from '@faker-js/faker'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
        display: true,
        text: 'Earnings in this Week',
        },
    },
};

const initialLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const initialData = {
    labels: initialLabels,
    datasets: [
        {
        fill: true,
        label: 'Earning in Birr',
        // data: initialLabels.map(() => faker.datatype.number({ min: 450, max: 1000 })),
        data: [1, 2, 3, 4, 5, 6, 7],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        },
    ],
};

type AreaChartProps = {
    labels: string[],
    values: number[]
}

export default function VerticalBarChart({labels, values}:AreaChartProps) {
    const [data, setData] = useState(initialData)
    useEffect(()=>{
        setData({
            labels,
            datasets: [
                {
                fill: true,
                label: 'Earning in Birr',
                data: values,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.7)',
                },
            ],
        })
    }, [labels, values])
    return <Bar options={options} data={data} />;
}
