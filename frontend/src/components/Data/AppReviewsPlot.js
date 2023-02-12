import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const AppReviewsPlot = ({ dataRating }) => {
  const createTicks = (start, end) => {
    // Note, start and end must be multiples of 0.25
    let ticks = [start];
    let value = start;

    while (value < end) {
      value += 0.25;
      ticks.push(value);
    }

    return ticks;
  };

  let minValue = 5;
  let formattedData = Object.entries(dataRating).map(([key, value]) => {
    if (value < minValue) {
      minValue = value;
    }
    return {
      date: key,
      rating: parseFloat(value).toFixed(2),
    };
  });

  const lowerDomain = Math.floor(minValue * 2) / 2;

  return (
    <ResponsiveContainer width='95%' height={500}>
      <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis type='number' domain={[lowerDomain, 5]} ticks={createTicks(lowerDomain, 5)} /> // Round DOWN to nearest 0.5
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='rating' stroke='#ff0000' />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AppReviewsPlot;
