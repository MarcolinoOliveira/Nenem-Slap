'use client'

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { AlignJustify, PencilLine, SquareX } from 'lucide-react';
import { clientsProps } from '@/interface/globalInterfaces';
import { DeleteClient } from './DeleteClient';
import { ChangeDataClient } from './ChangeDataClient';

interface SubMenuCLientProps {
  client: clientsProps
}

export const SubMenuClient = ({ client }: SubMenuCLientProps) => {

  const [openChange, setOpenChange] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size='icon' asChild><AlignJustify className="w-8 h-10" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col gap-2 lg:gap-0 p-2 border-border items-start" align='end'>
          <div className='flex pt-2 w-full flex-col gap-2 items-center'>
            {client.status != 'inativo' &&
              <Button variant='outline' className='flex gap-1' onClick={() => setOpenChange(prev => !prev)}>
                <PencilLine className="" />
                <p>Alterar</p>
              </Button>}
            <Button variant='outline' className='flex gap-1' onClick={() => setOpenDelete(prev => !prev)}>
              <SquareX className=" text-red-500" />
              <p>Deletar</p>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <ChangeDataClient client={client} open={openChange} setOpen={setOpenChange} />
      <DeleteClient id={client.id} open={openDelete} setOpen={setOpenDelete} status={client.status} />
    </div>
  );
}
