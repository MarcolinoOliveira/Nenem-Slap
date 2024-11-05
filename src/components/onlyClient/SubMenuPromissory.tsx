'use client'

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { EllipsisVertical, SquareX } from 'lucide-react';
import { promissoryPaymentProps } from '@/interface/globalInterfaces';
import { DeletePayment } from './DeletePayment';
import { DocumentData } from 'firebase/firestore';

interface SubMenuPromissoryProps {
  client: DocumentData
  promissoryPayment: promissoryPaymentProps
}

export const SubMenuPromissory = ({ client, promissoryPayment }: SubMenuPromissoryProps) => {

  const [openDelete, setOpenDelete] = useState<boolean>(false)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size='icon' asChild><EllipsisVertical className="w-8 h-10" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col lg:gap-0 p-2 border-border items-start" align='end'>
          <div className='flex w-full items-center'>
            <Button variant='outline' className='flex gap-1' onClick={() => setOpenDelete(prev => !prev)}>
              <SquareX className=" text-red-500" />
              <p>Deletar</p>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <DeletePayment client={client} open={openDelete} setOpen={setOpenDelete} promissoryPayment={promissoryPayment} />
    </div>
  );
}
