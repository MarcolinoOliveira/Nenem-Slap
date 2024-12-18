'use client'

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { EllipsisVertical, PenLine, SquareX } from 'lucide-react';
import { newBuyProps } from '@/interface/globalInterfaces';
import { DocumentData } from 'firebase/firestore';
import { ChangeBuyModal } from './ChangeBuyModal';
import { DeleteBuyModal } from './DeleteBuyModal';

interface SubMenuBuysProps {
  client: DocumentData
  newBuy: newBuyProps
}

export const SubMenuBuys = ({ client, newBuy }: SubMenuBuysProps) => {

  const [openChange, setOpenChange] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size='icon' asChild><EllipsisVertical className="w-4 h-6 ml-6" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col lg:gap-0 p-2 border-border items-start" align='end'>
          <div className='flex flex-col w-full items-center'>
            <Button variant='outline' className='flex gap-1' onClick={() => setOpenChange(prev => !prev)}>
              <PenLine />
              <p>Alterar</p>
            </Button>
            <Button variant='outline' className='flex gap-1' onClick={() => setOpenDelete(prev => !prev)}>
              <SquareX className='text-red-500' />
              <p>Deletar</p>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {client && <ChangeBuyModal client={client} newBuy={newBuy} open={openChange} setOpen={setOpenChange} />}
      {client && <DeleteBuyModal client={client} buy={newBuy} open={openDelete} setOpen={setOpenDelete} />}
    </div>
  );
}
