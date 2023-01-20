% Set the time step
h = 0.01;

% Set the final time
tf = 10;

% Set the initial time
t = 0;

% Set the mass, spring constant, damping constant, and length of spring
m1 = 1;
m2 = 1;
k = 10;
c = 2;
l = 1;

% Set the initial conditions
x0 = [0, 3, 0, 0];

% Preallocate the solution arrays
x = zeros(4, (tf/h) + 1);
x(:,1) = x0;

% Solve the ODE using the Euler method
i = 1;
while t <= tf
    k1 = spring_damper(t, x(:,i), m1, m2, k, c, l);
    k2 = spring_damper(t + h/2, x(:,i) + k1/2, m1, m2, k, c, l);
    k3 = spring_damper(t + h, x(:,i) + k2/2, m1, m2, k, c, l);
    k4 = spring_damper(t + h, x(:,i) + k3, m1, m2, k, c, l);
    x(:,i+1) = x(:,i) + (k1 + 2*k2 + 2*k3 + k4)/6;
    t = t + h;
    i = i + 1;
end

% Plot the solution
time = 0:h:tf + 0.01;
plot(time, x(1,:))
hold on
plot(time, x(2,:))
xlabel('Time')
ylabel('Position')
legend('Mass 1', 'Mass 2')
