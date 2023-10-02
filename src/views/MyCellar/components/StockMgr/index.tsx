import React from 'react';
import AssetEditor from '../AssetEditor';

const StockMgr = () => {
  return (
    <div className="flex-1 px-4 relative py-3 overflow-y-auto h-[calc(100vh-10vh)]">
      <AssetEditor />
    </div>
  );
};

export default StockMgr;
