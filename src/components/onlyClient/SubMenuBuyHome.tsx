'use client'

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { EllipsisVertical, PenLine } from 'lucide-react';
import { newBuyProps } from '@/interface/globalInterfaces';
import { DocumentData } from 'firebase/firestore';
import { ChangeBuyModal } from './ChangeBuyModal';

interface SubMenuBuysProps {
  client: DocumentData
  newBuy: newBuyProps
}

export const SubMenuBuyHome = ({ client, newBuy }: SubMenuBuysProps) => {

  const [openChange, setOpenChange] = useState<boolean>(false)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size='icon' asChild><EllipsisVertical className="w-4 h-6 ml-6" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col lg:gap-0 p-2 border-border items-start" align='end'>
          <div className='flex w-full items-center'>
            <Button variant='outline' className='flex gap-1' onClick={() => setOpenChange(prev => !prev)}>
              <PenLine />
              <p>Alterar</p>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {client && <ChangeBuyModal client={client} newBuy={newBuy} open={openChange} setOpen={setOpenChange} />}
    </div>
  );
}