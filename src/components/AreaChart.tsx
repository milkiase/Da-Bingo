import {useState, useEffect} from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import {faker} from '@faker-js/faker'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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

export default function AreaChart({labels, values}:AreaChartProps) {
    const [data, setData] = useState(initialData)
    useEffect(()=>{
        setData({
            labels: ['this week'],
            datasets: [
                {
                fill: true,
                label: 'Earning in Birr',
                data: [50],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.1)',
                },
            ],
        })
    }, [labels, values])
    return <Line options={options} data={data} />;
}
