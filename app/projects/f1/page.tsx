import React from 'react';

const Page = () => {
  return (
    <div>
      <p>to get mettings: https://api.openf1.org/v1/meetings?year=2026</p>
      <p>meeting_key: 1279</p>

      <p>to get polipositions and drivers numbers: https://api.openf1.org/v1/starting_grid?meeting_key=1279</p>

      <p>to get drivers data: https://api.openf1.org/v1/drivers?meeting_key=1279&session_key=latest</p>

      <p>
        to get driver location: https://api.openf1.org/v1/location?session_key=latest&driver_number=63&meeting_key=1279
      </p>

      <p>
        to get driver position: https://api.openf1.org/v1/position?meeting_key=1279&driver_number=63&session_key=latest
      </p>
    </div>
  );
};

export default Page;
