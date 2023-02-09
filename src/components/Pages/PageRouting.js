import React from "react";

import { Routes } from 'react-router-dom';

import routes from 'routes';
import routing from "utils/routing";

export default function PageRouting() {
  return(
    <>
      <Routes>
        {
          routes.map((route) => (
            routing(route)
          ))
        }
      </Routes>
    </>
  );
}