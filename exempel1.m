% Set the time step
h = 0.001;

% Set the final time
tf = 10;

% Set the initial time
t = 0;

% Set the initial conditions
y0 = [0, 0, 0, 0];

% Preallocate the solution arrays
%x = zeros(4, (tf/h) + 1);
%x(:,1) = x0;

% Solve the ODE using the Euler method
% i = 1;
% while t <= tf
%     x(:,i+1) = x(:,i) + h * spring_damper(t, x(:,i), m1, m2, k, c,l);
%     t = t + h;
%     i = i+1;
% end
[t,x] = Euler(@spring_damper, [t,tf], y0, 10000);

% Plot the solution
plot(t, x(1,:))
hold on
plot(t, x(2,:))
xlabel('Time')
ylabel('Position')
legend('Mass 1', 'Mass 2')
