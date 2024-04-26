import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function IconButton(props: ButtonProps) {
  return <button className='border rounded size-8 flex justify-center items-center' {...props}>
    {props.children}
  </button>;
}
