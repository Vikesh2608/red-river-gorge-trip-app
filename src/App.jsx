import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const supabase = createClient(
  'https://tmfqocpjhewmsdknvpzu.supabase.co',
  'sb_publishable_UHLS2ZiZfWFeSlFmW6muhQ_y1SH5-eF'
);

export default function TripApp() {
  const [members, setMembers] = useState(['Amit', 'John']);
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [expenses, setExpenses] = useState([
    { title: 'Cabin', amount: 300 },
    { title: 'Fuel', amount: 120 }
  ]);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [cars] = useState([
    { driver: 'Amit', seats: 4, passengers: 'John' }
  ]);

  const [timeline] = useState([
    { time: 'Fri 8:00 AM', task: 'Leave Atlanta' },
    { time: 'Fri 1:00 PM', task: 'Check-in Cabin' }
  ]);

  const totalBudget = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  useEffect(() => {
    loadMembers();
    loadExpenses();
  }, []);

  const loadMembers = async () => {
    const { data } = await supabase
      .from('members')
      .select('*')
      .order('id');

    if (data?.length) {
      setMembers(data.map((item) => item.name));
    }
  };

  const loadExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .order('id');

    if (data?.length) {
      setExpenses(data);
    }
  };

  const addMember = async () => {
    if (!name) return;

    await supabase.from('members').insert({ name });
    setMembers([...members, name]);
    setName('');
  };

  const addExpense = async () => {
    if (!expenseTitle || !expenseAmount) return;

    const row = {
      title: expenseTitle,
      amount: Number(expenseAmount)
    };

    await supabase.from('expenses').insert(row);

    setExpenses([...expenses, row]);
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const upload = (e) => {
    const files = [...e.target.files].map((file) =>
      URL.createObjectURL(file)
    );

    setPhotos([...photos, ...files]);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Red River Gorge Trip 2026
          </h1>
          <p className="text-slate-500">
            Live planner • public share ready • group collaboration
          </p>
        </div>

        <div className="flex gap-2">
          <Button>Invite Friends</Button>
          <Button variant="outline">Share Public Link</Button>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full max-w-5xl rounded-2xl">
          <TabsTrigger value="members">People</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="stay">Stay</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
        </TabsList>

        {/* PEOPLE */}
        <TabsContent value="members">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add member"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={addMember}>Add</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-white border rounded-xl"
                  >
                    {member}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BUDGET */}
        <TabsContent value="budget">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              <p className="text-2xl font-bold mb-4">
                Total Budget: ${totalBudget}
              </p>

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Expense title"
                  value={expenseTitle}
                  onChange={(e) =>
                    setExpenseTitle(e.target.value)
                  }
                />

                <Input
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) =>
                    setExpenseAmount(e.target.value)
                  }
                />

                <Button onClick={addExpense}>Add</Button>
              </div>

              {expenses.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-2"
                >
                  <span>{item.title}</span>
                  <span>${item.amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PHOTOS */}
        <TabsContent value="photos">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              <input
                type="file"
                multiple
                onChange={upload}
                className="mb-4"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    className="h-32 w-full object-cover rounded-2xl"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STAY */}
        <TabsContent value="stay">
          <Card className="rounded-2xl shadow p-4 mb-4">
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-white border rounded-xl">
                  Check-in: Fri 3 PM
                </div>
                <div className="p-3 bg-white border rounded-xl">
                  Check-out: Sun 11 AM
                </div>
                <div className="p-3 bg-white border rounded-xl">
                  WiFi Included
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              <p className="font-semibold">Cabin Address:</p>
              <p>123 Mountain View Rd, KY</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CARS */}
        <TabsContent value="cars">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              {cars.map((car, i) => (
                <div key={i} className="border-b py-2">
                  {car.driver} • Seats {car.seats} • Passengers:{' '}
                  {car.passengers}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              {timeline.map((item, i) => (
                <div key={i} className="border-b py-2">
                  <span className="font-bold">
                    {item.time}
                  </span>{' '}
                  - {item.task}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PUBLIC */}
        <TabsContent value="public">
          <Card className="rounded-2xl shadow p-4">
            <CardContent>
              <h3 className="font-bold text-xl mb-3">
                Public Trip Page
              </h3>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-white border rounded-xl">
                  Countdown: 14 days
                </div>

                <div className="p-3 bg-white border rounded-xl">
                  Members: {members.length}
                </div>

                <div className="p-3 bg-white border rounded-xl">
                  Budget: ${totalBudget}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
