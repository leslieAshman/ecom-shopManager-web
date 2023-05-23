import React from 'react';

const Spacer = ({ h }: { h: string }) => {
  return <div style={{ height: h }} className={`w-full`}></div>;
};

export default Spacer;
